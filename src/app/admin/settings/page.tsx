import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "super_admin") {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-neon-text-light dark:text-neon-text-dark">
            Settings
          </h1>
          <p className="mt-2 text-sm text-neon-text-light/60 dark:text-neon-text-dark/60">
            Manage global settings for Launch Verse Academy.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Site Settings */}
        <div className="bg-neon-card-light dark:bg-neon-card-dark shadow-neon-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-neon-text-light dark:text-neon-text-dark mb-4">
            Site Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="site-name"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Site Name
              </label>
              <input
                type="text"
                id="site-name"
                defaultValue="Launch Verse Academy"
                className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
            <div>
              <label
                htmlFor="site-description"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Site Description
              </label>
              <textarea
                id="site-description"
                rows={3}
                defaultValue="Professional computer training institute offering courses in Web Development, Graphic Design, Web Design, and MS Office. Get certified and launch your career today."
                className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-neon-card-light dark:bg-neon-card-dark shadow-neon-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-neon-text-light dark:text-neon-text-dark mb-4">
            Email Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="smtp-host"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                SMTP Host
              </label>
              <input
                type="text"
                id="smtp-host"
                className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
            <div>
              <label
                htmlFor="smtp-port"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                SMTP Port
              </label>
              <input
                type="number"
                id="smtp-port"
                className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
            <div>
              <label
                htmlFor="smtp-username"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                SMTP Username
              </label>
              <input
                type="text"
                id="smtp-username"
                className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
            <div>
              <label
                htmlFor="smtp-password"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                SMTP Password
              </label>
              <input
                type="password"
                id="smtp-password"
                className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              />
            </div>
          </div>
        </div>

        {/* Certificate Settings */}
        <div className="bg-neon-card-light dark:bg-neon-card-dark shadow-neon-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-neon-text-light dark:text-neon-text-dark mb-4">
            Certificate Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="certificate-template"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Certificate Template
              </label>
              <select
                id="certificate-template"
                className="mt-1 block w-full rounded-md border border-neon-primary/10 dark:border-neon-primary-dark/10 bg-neon-background-light dark:bg-neon-background-dark px-3 py-2 text-neon-text-light dark:text-neon-text-dark focus:outline-none focus:ring-2 focus:ring-neon-primary dark:focus:ring-neon-primary-dark"
              >
                <option value="default">Default Template</option>
                <option value="modern">Modern Template</option>
                <option value="classic">Classic Template</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="certificate-signature"
                className="block text-sm font-medium text-neon-text-light dark:text-neon-text-dark"
              >
                Certificate Signature
              </label>
              <input
                type="file"
                id="certificate-signature"
                accept="image/*"
                className="mt-1 block w-full text-sm text-neon-text-light/60 dark:text-neon-text-dark/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neon-primary dark:file:bg-neon-primary-dark file:text-white hover:file:bg-neon-primary/90 dark:hover:file:bg-neon-primary-dark/90"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md bg-neon-primary dark:bg-neon-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary dark:focus-visible:outline-neon-primary-dark"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
