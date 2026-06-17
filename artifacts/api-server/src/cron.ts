import cron from "node-cron";
import { nanoid } from "nanoid";
import { sendWhatsApp } from "./routes/whatsapp";
import { logger } from "./lib/logger";

// ─── In-memory stores (swap each section for Supabase queries when DB is wired) ─

interface ScheduledCard {
  id: string;
  sender_name: string;
  recipient_name: string;
  experience: string;
  share_token: string;
  receiver_whatsapp: string;
  scheduled_at: string;
  whatsapp_sent: boolean;
  is_paid: boolean;
  message: string;
}

interface UserRecord {
  id: string;
  sender_whatsapp: string;
  partner_name: string;
  anniversary_date: string | null;
  plan: string;
  streak_months: number;
  streak_badge: string | null;
}

interface LoveDrop {
  id: string;
  send_day: number;
  is_active: boolean;
  last_sent_at: string | null;
  cards: ScheduledCard;
  users: UserRecord;
}

// Seed with empty collections — populate from DB when Supabase is available
const scheduledCards: ScheduledCard[] = [];
const users: UserRecord[] = [];
const loveDrops: LoveDrop[] = [];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntilNextOccurrence(dateStr: string): number {
  const today = new Date();
  const target = new Date(dateStr);
  target.setFullYear(today.getFullYear());
  if (target <= today) target.setFullYear(today.getFullYear() + 1);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

async function callAiMessage(
  experience: string,
  recipientName: string,
  senderName: string
): Promise<string> {
  try {
    const res = await fetch("http://localhost:8080/api/ai/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experience, recipientName, senderName, tone: "Romantic" }),
    });
    const data = await res.json() as { messages?: string[] };
    return data.messages?.[0] ?? `${recipientName}, you mean everything to me 💕`;
  } catch {
    return `${recipientName}, you mean everything to me 💕`;
  }
}

// ─── CRON 1 — Scheduled Delivery (every minute) ──────────────────────────────
// Sends card link via WhatsApp when scheduled_at has passed and not yet sent.
cron.schedule("* * * * *", async () => {
  const now = new Date().toISOString();

  // TODO (Supabase): replace with:
  // const { data: cards } = await supabase.from("cards")
  //   .select("*").lte("scheduled_at", now).eq("whatsapp_sent", false)
  //   .eq("is_paid", true).not("receiver_whatsapp", "is", null)
  const due = scheduledCards.filter(
    (c) => c.scheduled_at <= now && !c.whatsapp_sent && c.is_paid && c.receiver_whatsapp
  );

  for (const card of due) {
    await sendWhatsApp(
      card.receiver_whatsapp,
      `${card.sender_name} sent you something 💝\nheartdrop.in/card/${card.share_token}`
    );
    card.whatsapp_sent = true;
    // TODO (Supabase): await supabase.from("cards").update({ whatsapp_sent: true }).eq("id", card.id)
    logger.info({ cardId: card.id }, "Scheduled delivery sent");
  }
});

// ─── CRON 2 — Anniversary Reminders (daily 9 AM) ─────────────────────────────
// Alerts the sender 7 days and 1 day before their anniversary.
cron.schedule("0 9 * * *", async () => {
  // TODO (Supabase): replace with:
  // const { data: users } = await supabase.from("users").select("*")
  //   .not("anniversary_date","is",null).not("sender_whatsapp","is",null)

  for (const user of users) {
    if (!user.anniversary_date || !user.sender_whatsapp) continue;
    const daysLeft = daysUntilNextOccurrence(user.anniversary_date);

    if (daysLeft === 7 || daysLeft === 1) {
      await sendWhatsApp(
        user.sender_whatsapp,
        `🗓 Anniversary with ${user.partner_name} in ${daysLeft} day${daysLeft > 1 ? "s" : ""}!\n` +
        `heartdrop.in/create?type=anniversary`
      );
      logger.info({ userId: user.id, daysLeft }, "Anniversary reminder sent");
    }
  }
});

// ─── CRON 3 — Monthly Love Drop (daily 10 AM) ────────────────────────────────
// Auto-generates and delivers a new card each month on the user's chosen day.
cron.schedule("0 10 * * *", async () => {
  const todayDay = new Date().getDate();

  // TODO (Supabase): replace with:
  // const { data: drops } = await supabase.from("love_drops")
  //   .select("*, cards(*), users(*)").eq("send_day", todayDay).eq("is_active", true)
  const due = loveDrops.filter((d) => d.send_day === todayDay && d.is_active);

  for (const drop of due) {
    try {
      const message = await callAiMessage(
        drop.cards.experience,
        drop.cards.recipient_name,
        drop.cards.sender_name
      );

      const shareToken = nanoid(10);

      // TODO (Supabase): replace with:
      // const { data: newCard } = await supabase.from("cards").insert({
      //   ...drop.cards, id: undefined, message, share_token: shareToken,
      //   is_paid: true, watermarked: false, expires_at: null,
      //   whatsapp_sent: false, created_at: new Date().toISOString()
      // }).select().single()
      scheduledCards.push({
        ...drop.cards,
        id: nanoid(),
        message,
        share_token: shareToken,
        whatsapp_sent: false,
        is_paid: true,
      });

      const recipientPhone = drop.cards.receiver_whatsapp || drop.users.sender_whatsapp;
      await sendWhatsApp(
        recipientPhone,
        `${drop.cards.sender_name} sent you a monthly surprise 💝\n` +
        `heartdrop.in/card/${shareToken}`
      );

      // Update timestamps
      const nextSend = new Date();
      nextSend.setMonth(nextSend.getMonth() + 1);
      drop.last_sent_at = new Date().toISOString();
      // TODO (Supabase): await supabase.from("love_drops").update({
      //   last_sent_at: new Date().toISOString(), next_send_at: nextSend.toISOString()
      // }).eq("id", drop.id)

      logger.info({ dropId: drop.id, shareToken }, "Love drop sent");
    } catch (err) {
      logger.error({ err, dropId: drop.id }, "Love drop failed");
    }
  }
});

// ─── CRON 4 — Streak Calculator (1st of month, 8 AM) ─────────────────────────
// Increments streak for unlimited users who sent a paid card last month.
cron.schedule("0 8 1 * *", async () => {
  const lastMonthStart = new Date();
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  lastMonthStart.setDate(1);
  lastMonthStart.setHours(0, 0, 0, 0);

  // TODO (Supabase): replace with:
  // const { data: unlimitedUsers } = await supabase.from("users")
  //   .select("*").eq("plan","unlimited")
  const unlimitedUsers = users.filter((u) => u.plan === "unlimited");

  for (const user of unlimitedUsers) {
    // TODO (Supabase): replace with:
    // const { data: cards } = await supabase.from("cards").select("id")
    //   .eq("sender_id", user.id).eq("is_paid", true)
    //   .gte("created_at", lastMonthStart.toISOString())
    const sentLastMonth = scheduledCards.filter(
      (c) => c.is_paid && new Date(c.scheduled_at) >= lastMonthStart
    );

    if (sentLastMonth.length > 0) {
      const newStreak = (user.streak_months || 0) + 1;
      let badge = user.streak_badge;
      if (newStreak >= 12) badge = "legendary_lover";
      else if (newStreak >= 6) badge = "loyal_heart";

      user.streak_months = newStreak;
      user.streak_badge = badge;
      // TODO (Supabase): await supabase.from("users")
      //   .update({ streak_months: newStreak, streak_badge: badge }).eq("id", user.id)

      if (newStreak === 6 || newStreak === 12) {
        await sendWhatsApp(
          user.sender_whatsapp,
          newStreak === 6
            ? "🏅 Loyal Heart unlocked! 6 month streak!\nheartdrop.in/dashboard"
            : "👑 Legendary Lover! 12 months of surprises!\nheartdrop.in/dashboard"
        );
      }
      logger.info({ userId: user.id, newStreak, badge }, "Streak updated");
    } else {
      user.streak_months = 0;
      // TODO (Supabase): await supabase.from("users").update({ streak_months: 0 }).eq("id", user.id)
      logger.info({ userId: user.id }, "Streak reset — no cards last month");
    }
  }
});

logger.info("Cron jobs registered: scheduled-delivery, anniversary-reminders, love-drop, streak-calculator");
