import { getMealPrice } from '../../[userId]/route'

interface RequestParams {
  date: string;
}

interface PriceResponse {
  price: number;
  success: boolean;
}

export async function POST(
  _: Request,
  props: { params: RequestParams }
): Promise<Response> {
  const {
    date
  } = props.params;

  const price = await getMealPrice(date);
  return Response.json({ price, success: true } as PriceResponse);
}
