import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';

export function MyCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Project Title</CardTitle>
        <CardDescription>Student-Alumni Collaboration</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is where your card content goes.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  );
}
