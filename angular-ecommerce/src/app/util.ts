export function getUserMailFromLocalStorage(): string | undefined {
  const emailJSON = localStorage.getItem('userMail');
  if (emailJSON) {
    return JSON.parse(emailJSON);
  }
  return undefined;
}
