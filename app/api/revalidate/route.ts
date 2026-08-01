import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 })
  }

  const { isValidSignature } = await parseBody(request, secret, true)

  if (!isValidSignature) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/', 'page')
  revalidatePath('/product/[id]', 'page')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
