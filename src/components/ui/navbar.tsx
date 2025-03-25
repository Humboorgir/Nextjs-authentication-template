import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Container from "@/components/ui/container";
import Dropdown from "@/components/ui/dropdown";
import Skeleton from "@/components/ui/skeleton";

import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";

import { LogOut as SignOutIcon } from "lucide-react";

export default function Navbar() {
  // TODO: clean up the code here
  const { isLoading, data } = useUser();
  const { signOut } = useAuth();

  return (
    <header>
      <Container className="flex justify-between items-center py-2 w-full">
        <Text variant="h5">Auth Template</Text>
        <nav>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : data?.user ? (
            <Dropdown
              items={[
                {
                  name: (
                    <>
                      <SignOutIcon className="w-4 h-4 mr-2" /> Sign Out
                    </>
                  ),
                  onClick: signOut,
                },
              ]}
              variant="outline">
              {data.user.name}
            </Dropdown>
          ) : (
            <ul className="flex items-center">
              <li>
                <Button href="/sign-in" variant="ghost">
                  Sign in
                </Button>
              </li>

              <li>
                <Button href="/sign-up">Sign up</Button>
              </li>
            </ul>
          )}
        </nav>
      </Container>
    </header>
  );
}
