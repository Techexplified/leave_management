import { getInitials, getAvatarColor, DEFAULT_STANDALONE_MEMBERS } from './data/mockData';

// Trello Power-Up Context Helper for Modal and Card-Back Iframe
export function isInsideTrello() {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function getTrelloContext() {
  if (typeof window === 'undefined') return null;

  if (!isInsideTrello()) {
    return null;
  }

  if (window.TrelloPowerUp && typeof window.TrelloPowerUp.iframe === 'function') {
    try {
      return window.TrelloPowerUp.iframe();
    } catch (e) {
      console.warn('Failed to initialize Trello iframe context:', e);
      return null;
    }
  }

  return null;
}

export function autoSize(t) {
  if (t && typeof t.sizeTo === 'function') {
    try {
      t.sizeTo('#root').catch(() => {});
    } catch {}
  }
}

// Fetch all actual members belonging to the current Trello board
export async function getBoardMembers(t) {
  if (t && typeof t.board === 'function') {
    try {
      const board = await t.board('id', 'name', 'members');
      const rawMembers = board?.members || [];
      if (rawMembers.length > 0) {
        return rawMembers.map(m => ({
          id: m.id,
          name: m.fullName || m.username || 'Member',
          username: m.username ? `@${m.username}` : '',
          initials: m.initials || getInitials(m.fullName || m.username),
          avatar: m.avatar || null,
          avatarColor: getAvatarColor(m.id || m.fullName)
        }));
      }
    } catch (e) {
      console.warn('Could not fetch board members from Trello:', e);
    }
  }

  return DEFAULT_STANDALONE_MEMBERS;
}

// Fetch currently logged-in Trello user with context fallback
export async function getCurrentTrelloMember(t) {
  if (t) {
    // 1. Try t.member()
    if (typeof t.member === 'function') {
      try {
        const m = await t.member('id', 'fullName', 'username', 'avatar', 'initials');
        if (m && m.id) {
          return {
            id: m.id,
            name: m.fullName || m.username || 'Current User',
            username: m.username ? `@${m.username}` : '',
            initials: m.initials || getInitials(m.fullName || m.username),
            avatar: m.avatar || null,
            avatarColor: getAvatarColor(m.id || m.fullName)
          };
        }
      } catch (e) {
        console.warn('Could not fetch current member via t.member:', e);
      }
    }

    // 2. Context fallback
    if (typeof t.getContext === 'function') {
      try {
        const ctx = t.getContext();
        if (ctx && ctx.member) {
          const board = await t.board('id', 'name', 'members');
          const matched = board?.members?.find(bm => bm.id === ctx.member);
          if (matched) {
            return {
              id: matched.id,
              name: matched.fullName || matched.username || 'Current User',
              username: matched.username ? `@${matched.username}` : '',
              initials: matched.initials || getInitials(matched.fullName || matched.username),
              avatar: matched.avatar || null,
              avatarColor: getAvatarColor(matched.id || matched.fullName)
            };
          }
        }
      } catch (e) {
        console.warn('Could not fetch member via context:', e);
      }
    }
  }

  return null;
}

// Fetch current board name
export async function getBoardName(t) {
  if (t && typeof t.board === 'function') {
    try {
      const board = await t.board('name');
      return board?.name || 'Active Trello Board';
    } catch {}
  }
  return 'Active Trello Board';
}

// Fetch real lists and cards from the active Trello board
export async function getBoardCardsAndLists(t) {
  if (t && typeof t.lists === 'function' && typeof t.cards === 'function') {
    try {
      const [lists, cards] = await Promise.all([
        t.lists('id', 'name'),
        t.cards('id', 'name', 'idList', 'members', 'due')
      ]);
      if (Array.isArray(lists) && lists.length > 0) {
        return { lists, cards: cards || [] };
      }
    } catch (e) {
      console.warn('Could not fetch board lists/cards from Trello:', e);
    }
  }
  return null;
}
