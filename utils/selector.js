export function getAll(string) {
  const value = document.querySelectorAll(string);
  return value;
}

export function getFirst(string) {
  const value = document.querySelector(string);
  return value;
}
