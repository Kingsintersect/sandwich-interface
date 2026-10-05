import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";

interface CreateUserCardProps {
    basePath: string;
}

export const CreateUserCard = ({ basePath }: CreateUserCardProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create A Student / Teacher / Admin</CardTitle>
                <CardDescription>Click the button to create user</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* Content can be added here if needed */}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button asChild className="bg-site-b-dark hover:bg-site-b">
                    <Link href={`${basePath}/create/new`}>
                        <Icon icon={PlusSignIcon} /> Add New User
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};