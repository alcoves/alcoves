
const adminIds = ['1'];

export default function isAdmin(id = '') {
  id = id.toString();
  if (adminIds.includes(id)) {
    return true;
  }
  return false;
}