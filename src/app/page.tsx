import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import ResolutionForm from '@/components/resolution-form'

export default function SendPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Submit Your New Year&apos;s Resolution</CardTitle>
          <CardDescription>Share your goals for the upcoming year!</CardDescription>
        </CardHeader>
        <CardContent>
          <ResolutionForm />
        </CardContent>
      </Card>
    </div>
  )
}
