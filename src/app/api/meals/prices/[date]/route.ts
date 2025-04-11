import { getMealPrice } from '../../[userId]/route'

export async function POST(_, props: { params: Promise<{ date: string }> }) {
  const params = await props.params;

  const {
    date
  } = params;

  const price = await getMealPrice(date)
  return Response.json({ price, success: true })
}
