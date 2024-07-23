import { getMealPrice } from '../../[userId]/route'

export async function POST(_, { params: { date } }: { params: { date: string } }) {
  const price = await getMealPrice(date)
  return Response.json({ price, success: true })
}
