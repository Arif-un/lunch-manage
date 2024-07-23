import Link from 'next/link'

import ContentWrapper from '../components/content-wrapper'
import MealButton from '../components/meal-button'
import MealDate from '../components/meal-date'
import NavButton from '../components/nav-button'
import TotalBar from '../components/total-bar'
import { Button } from '../components/ui/button'
import { dateToday } from '../lib/utils'
import { fetchUsersWithMeals } from '../server/usersActions'

export default async function Home({
  searchParams: { date = dateToday() }
}: {
  searchParams: { date: string }
}) {
  const usersWithMeals = await fetchUsersWithMeals(date)

  const quantity =
    usersWithMeals?.reduce((acc, cur) => {
      if (cur?.mealPrice && cur.mealPrice > 0) {
        // eslint-disable-next-line no-param-reassign
        acc += 1
      }
      return acc
    }, 0) || 0

  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-slate-50">
        <div className="w-10/12 md:w-3/6 ">
          <div className="my-3 flex justify-between">
            <div className="flex items-center gap-3">
              <NavButton />
              <Button asChild variant="link" className="justify-start p-0 font-semibold">
                <Link href={`/?date=${dateToday()}`}>Lunch</Link>
              </Button>
            </div>

            <MealDate date={date} />
          </div>

          <TotalBar quantity={quantity} date={date} />

          <div className="mt-4 grid w-full grid-cols-2 place-content-center gap-4">
            {usersWithMeals?.map(user => (
              <MealButton
                key={user?.userId}
                name={user?.name}
                id={user?.userId}
                price={user?.mealPrice}
                date={date}
                lastUpdatedAt={user.lastUpdatedAt as string}
                lastUpdatedBy={user.lastUpdatedBy as string}
              />
            ))}
          </div>
        </div>
      </main>
    </ContentWrapper>
  )
}
