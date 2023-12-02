import { NextResponse } from "next/server";
import fsPromises from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic"; // defaults to force-static
export async function GET(req: Request) {
  try {
    const res = await fsPromises.readFile(
      path.join(process.cwd(), "assets/json/arrows.json")
    );
    return NextResponse.json(JSON.parse(res.toString()), {
      status: 200,
    });
  } catch (e: unknown) {
    if (e instanceof TypeError) {
      return NextResponse.json(
        { error: e.message },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { error: "server error" },
        {
          status: 400,
        }
      );
    }
  }
}
