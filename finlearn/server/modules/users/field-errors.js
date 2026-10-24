export function fieldErrors(zodError) {
  const errors = {}
  for (const issue of zodError.issues) {
    errors[issue.path[0]] = issue.message
  }
  return errors
}
