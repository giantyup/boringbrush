import { ContactsManager } from "@/components/admin/contacts-manager";
import { getContactRequests } from "@/lib/data/admin";

export default async function AdminContactsPage() {
  const contacts = await getContactRequests();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Inquiries</h2>
        <p className="text-sm text-charcoal">
          Read, reply, archive, and manage contact form submissions.
        </p>
      </div>

      <ContactsManager initial={contacts} />
    </div>
  );
}
