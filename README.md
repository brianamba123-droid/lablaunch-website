# LabLaunch website

## Admin portal status

The admin portal is intentionally disabled. The previous admin credentials were embedded in the public frontend, and its session check relied on editable browser storage. Neither approach provides authentication or access control.

The admin login page no longer accepts passwords. Direct navigation to admin dashboard routes redirects to the disabled-login notice and clears any legacy browser-stored admin session. Do not restore admin access using frontend environment variables, hardcoded credentials, or `localStorage`; a static-site client cannot keep secrets or enforce authorization.

Before enabling the portal, implement server-side authentication and authorization, protect every admin data operation on the server, and decide where lab/client records and uploaded documents may be stored. The current app's browser-local storage is not shared across devices and is not a suitable security boundary for sensitive client data.

