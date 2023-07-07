import { renderToMjml } from '@faire/mjml-react/utils/renderToMjml';
import mjml2html from 'mjml';
import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlFont,
  MjmlStyle,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlImage,
  MjmlSocial,
  MjmlSocialElement,
} from '@faire/mjml-react';
import type { evaluate } from '@mdx-js/mdx';
import logoUrl from '../assets/logo.png';
import facebookLogoUrl from '../assets/brand-facebook.png';
import twitterLogoUrl from '../assets/brand-twitter.png';
import githubLogoUrl from '../assets/brand-github.png';
import gitlabLogoUrl from '../assets/brand-gitlab.png';

const fontFamily = 'Inter, sans-serif';

// MJML is rendered via react and api routes rather than astro in order to avoid astro attempting to hoist inline styles away into separate files
export function renderEmail(
  Content: Awaited<ReturnType<typeof evaluate>>['default'],
  webUrl: string,
  title: string,
  preview = title,
) {
  const { html, errors } = mjml2html(
    renderToMjml(
      <Mjml>
        <MjmlHead>
          <MjmlTitle>{title}</MjmlTitle>
          <MjmlFont
            name="Inter"
            href="https://unpkg.com/@fontsource/inter@5.0.3/index.css"
          />
          <MjmlPreview>{preview}</MjmlPreview>
          <MjmlStyle>
            {`
              a {
                color: inherit;
                text-decoration: underline;
                text-decoration-style: dotted;
              }
              a.plain {
                text-decoration: none;
                color: inherit;
              }
              a:hover {
                text-decoration: underline;
              }
            `}
          </MjmlStyle>
        </MjmlHead>
        <MjmlBody>
          <MjmlSection>
            <MjmlColumn>
              <MjmlText align="right" fontFamily={fontFamily} color="#111111">
                <a href={webUrl} className="plain" target="_blank">
                  View in Browser
                </a>
              </MjmlText>
              <MjmlImage
                width="250px"
                src={logoUrl}
                href="https://lets.church"
                target="_blank"
              />
              <MjmlText
                fontFamily={fontFamily}
                fontSize="16px"
                color="#111111"
                lineHeight="165%"
              >
                <h1>{title}</h1>
                <Content />
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
          <MjmlSection>
            <MjmlColumn>
              <MjmlSocial font-size="12px" icon-size="20px" mode="horizontal">
                <MjmlSocialElement
                  src={facebookLogoUrl}
                  href="https://www.facebook.com/profile.php?id=100092315746719"
                />
                <MjmlSocialElement
                  src={twitterLogoUrl}
                  href="https://twitter.com/lets_church"
                />
                <MjmlSocialElement
                  src={githubLogoUrl}
                  href="https://github.com/LetsChurch/"
                />
                <MjmlSocialElement
                  src={gitlabLogoUrl}
                  href="https://gitlab.com/LetsChurch/"
                />
              </MjmlSocial>
            </MjmlColumn>
          </MjmlSection>
          <MjmlSection>
            <MjmlColumn>
              <MjmlText
                fontFamily={fontFamily}
                fontSize="16px"
                fontWeight="bold"
                color="#111111"
                align="center"
              >
                <a href="https://lets.church" className="plain" target="_blank">
                  Let's Church
                </a>
              </MjmlText>
              <MjmlText fontFamily={fontFamily} color="#111111" align="center">
                You received this email because you signed up for our
                newsletter.
              </MjmlText>
              <MjmlText fontFamily={fontFamily} color="#111111" align="center">
                <a href="#" className="plain" target="_blank">
                  Unsubscribe
                </a>
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
        </MjmlBody>
      </Mjml>,
    ),
    { validationLevel: 'soft' },
  );

  for (const error of errors) {
    console.warn(error);
  }

  return html;
}
