import { describe, expect, test } from "bun:test";
import { findActiveNavHref } from "@workspace/ui/services/navigation/find-active-nav-href.service";

const organizationLinks = [
  { href: "/organizations/1", label: "Overview" },
  { href: "/organizations/1/members", label: "Members" },
  { href: "/organizations/1/roles", label: "Roles" },
];

describe("findActiveNavHref", () => {
  test("matches the exact path", () => {
    expect(findActiveNavHref("/organizations/1", organizationLinks)).toBe(
      "/organizations/1",
    );
  });

  test("prefers the most specific link on a subpage", () => {
    expect(
      findActiveNavHref("/organizations/1/roles/abc", organizationLinks),
    ).toBe("/organizations/1/roles");
  });

  test("ignores paths that only share a text prefix", () => {
    expect(
      findActiveNavHref("/organizations/1/membership", organizationLinks),
    ).toBe("/organizations/1");
  });

  test("returns null when no link matches", () => {
    expect(findActiveNavHref("/account", organizationLinks)).toBeNull();
  });

  test("treats the root link as active only on the home page", () => {
    const links = [
      { href: "/", label: "Home" },
      { href: "/organizations", label: "Organizations" },
    ];
    expect(findActiveNavHref("/", links)).toBe("/");
    expect(findActiveNavHref("/organizations/1", links)).toBe("/organizations");
  });
});
