import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function AlumniProfile({ alumni }) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={alumni.profilePicture} />
            <AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{alumni.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{alumni.email}</p>
            <div className="flex items-center pt-2">
              <Button variant="outline" size="sm" asChild>
                <a href={alumni.linkedIn} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{alumni.bio}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Education</h3>
              <p>
                {alumni.degree}, {alumni.graduationYear}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Career</h3>
              <p>
                {alumni.position} at {alumni.company}
              </p>
              <p>Industry: {alumni.industry}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
