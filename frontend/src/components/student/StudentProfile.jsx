import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function StudentProfile({ student }) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student.profilePicture} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{student.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{student.bio}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Academic Information</h3>
              <p>Student ID: {student.studentId}</p>
              <p>Major: {student.major}</p>
              <p>
                Enrollment: {student.enrollmentYear} - {student.expectedGraduationYear}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
