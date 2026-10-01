# Sprint Backlog

Use this file to capture bugs, UX issues, and feature ideas as they come up. Move items into a sprint plan when ready to implement.

## To Do

- [ ] Add a fast hover tooltip to the top navigation logout icon.
  - Type: UX improvement
  - Current issue: The logout button is icon-only and its action is not obvious.
  - Desired behavior: When hovering over the logout icon, show a tooltip immediately or near-immediately that says `Log out`.
  - Area: `frontend/src/components/layout/TopNav.tsx`
- [ ] Remove technical implementation language from the login page.
  - Type: UX/content cleanup
  - Current issue: The login page shows user-irrelevant technical labels such as `JWT session` and `Protected API`.
  - Desired behavior: Replace or remove those labels so the page speaks to the user, not the implementation.
  - Area: `frontend/src/app/login/page.tsx`
- [ ] Add a show/hide password control to the login form.
  - Type: UX improvement
  - Current issue: Users cannot verify the password they typed before submitting.
  - Desired behavior: Add an eye icon inside or next to the password field that toggles password visibility.
  - Area: `frontend/src/app/login/LoginForm.tsx`

## Done
