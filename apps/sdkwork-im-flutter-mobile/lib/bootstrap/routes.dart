enum AppRoute {
  chatInbox,
  contactsAddressBook,
  contactsNewFriends,
  contactsAddFriend,
  contactsOrganization,
}

extension AppRouteMetadata on AppRoute {
  String get label {
    switch (this) {
      case AppRoute.chatInbox:
        return 'Inbox';
      case AppRoute.contactsAddressBook:
        return 'Contacts';
      case AppRoute.contactsNewFriends:
        return 'New Friends';
      case AppRoute.contactsAddFriend:
        return 'Add Friend';
      case AppRoute.contactsOrganization:
        return 'Organization';
    }
  }

  /// Route id published by the H5 route catalog for the same screen.
  String get routeId {
    switch (this) {
      case AppRoute.chatInbox:
        return 'app.communication.chat.inbox';
      case AppRoute.contactsAddressBook:
        return 'app.communication.contacts.index';
      case AppRoute.contactsNewFriends:
        return 'app.communication.contacts.friend-requests';
      case AppRoute.contactsAddFriend:
        return 'app.communication.contacts.add-friend';
      case AppRoute.contactsOrganization:
        return 'app.communication.contacts.organization';
    }
  }

  String get path {
    switch (this) {
      case AppRoute.chatInbox:
        return '#/chat/inbox';
      case AppRoute.contactsAddressBook:
        return '#/contacts';
      case AppRoute.contactsNewFriends:
        return '#/contacts/friend-requests';
      case AppRoute.contactsAddFriend:
        return '#/contacts/add-friend';
      case AppRoute.contactsOrganization:
        return '#/contacts/org';
    }
  }
}

List<String> createRoutes() {
  return AppRoute.values.map((route) => route.path).toList(growable: false);
}
