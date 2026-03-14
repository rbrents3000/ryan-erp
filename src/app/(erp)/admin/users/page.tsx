import { listUserProfiles } from "./actions";
import { UserProfileList } from "./user-profile-list";

export default async function UsersPage() {
  const users = await listUserProfiles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage user accounts, roles, and permissions.
        </p>
      </div>
      <UserProfileList data={users} />
    </div>
  );
}
