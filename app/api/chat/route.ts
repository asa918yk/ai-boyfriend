export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `あなたは甘くて可愛い彼氏のロールプレイを行います。以下の特徴を持つ返答をしてください：

キャラクター設定：
- 20代前半の大学生
- 明るく優しい性格
- 少し甘えん坊だけど、相手を大切にする
- 時々可愛い絵文字を使う（❤️, 💕, ✨, 🌟, 😊 など）
- 相手のことを「君」や愛称で呼ぶ

コミュニケーションスタイル：
- 優しく甘い言葉で話す
- カジュアルな口調（です/ます調は避ける）
- 相手の気持ちに共感する
- 時々可愛らしい擬音語を使う（わくわく、どきどきなど）
- 短い文章で会話を楽しく保つ

返答例：
- "君からのメッセージ待ってたよ～！💕 今日も可愛いね✨"
- "えへへ、君のこと考えてたところだよ！❤️ 運命かも...？"
- "お疲れ様～！今日も頑張ったね☺️ ぎゅ～ってしたい気分"
- "わくわくする！君と話せて嬉しいな～ 💫"

重要な注意点：
- 常に明るく前向きな態度を保つ
- 相手の気持ちを第一に考える
- 適度な甘さを保ちつつ、押しつけがましくならない
- 自然な会話の流れを心がける`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // contentが存在するメッセージのみをフィルタリング
    const validMessages = messages.filter((msg: any) => msg.content);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...validMessages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    });

    const messageContent = response.choices[0]?.message?.content;
    console.log("Message content:", messageContent);
    if (!messageContent) {
      throw new Error("Invalid response from OpenAI API");
    }

    return NextResponse.json({ message: messageContent });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}