import { getCachedGlobal } from "@/utilities/getGlobals";
import Link from "next/link";
import React from "react";

import type { Footer as FooterGlobal, Media } from "@/payload-types";

import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";

export async function Footer() {
  const footerData = (await getCachedGlobal("footer", 1)()) as FooterGlobal | null;

  const brand = footerData?.brand;
  const sections = footerData?.sections || [];
  const credit = footerData?.credit;

  const [firstSection, ...otherSections] = sections;

  // Safely narrow logo to Media
  const logo: Media | null =
    brand && typeof brand.logo === "object" && brand.logo && "url" in brand.logo
      ? (brand.logo as Media)
      : null;

  return (
    <footer className="bg-footer text-neutral-content dark:bg-card z-10 mt-auto border-t bg-linear-to-bl  from-primary  to-neutral">
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand and first section under it */}
          <div className="space-y-10">
            {brand && (
              <div>
                <Link className="flex items-center mb-4" href="/">
                  {logo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo.url as string} alt="Logo" className="h-10 w-auto invert" />
                  ) : (
                    <Logo className="invert" />
                  )}
                </Link>
              </div>
            )}

            {firstSection && (
              <div>
                {firstSection.title && (
                  <h3 className="font-semibold text-lg mb-4">{firstSection.title}</h3>
                )}
                <ul className="space-y-2">
                  {(firstSection.links || []).map(({ link }, j) => (
                    <li key={j}>
                      <CMSLink
                        className="text-footer-muted hover:text-footer-foreground transition-colors text-sm hover:cursor-pointer hover:underline"
                        {...link}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Remaining sections */}
          {otherSections.map((section, i) => {
            const colStart = section.colStartLg;
            const colStartClass = colStart ? `lg:col-start-${colStart}` : undefined;
            return (
              <div key={i} className={`space-y-10 ${colStartClass ?? ""}`.trim()}>
                <div>
                  {section.title && (
                    <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                  )}
                  <ul className="space-y-2">
                    {(section.links || []).map(({ link }, j) => (
                      <li key={j}>
                        <CMSLink
                          className="text-footer-muted hover:text-footer-foreground transition-colors text-sm"
                          {...link}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Credit */}
      <div className="border-t border-footer-border">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-footer-muted text-sm">
            {credit ? (
              credit
            ) : (
              <span className="inline-flex items-center justify-center">
                Dezvoltat de Alacrity Education
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
