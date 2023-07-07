import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderEmail } from '../../layouts/email';
import { getCollection } from 'astro:content';
import { evaluate } from '@mdx-js/mdx';
import invariant from 'tiny-invariant';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));

  return paths;
}

const development = process.env.NODE_ENV === 'development';

export const get: APIRoute = async (context) => {
  const site = context.site;
  const props = context.props as CollectionEntry<'blog'>;
  const origin = site?.origin;
  invariant(origin);

  const runtime = await (development
    ? import('react/jsx-dev-runtime')
    : import('react/jsx-runtime'));

  const { default: Content } = await evaluate(
    props.body,
    // @ts-ignore: for some reason `Fragment` is missing from the types
    {
      ...runtime,
      development,
    },
  );

  return new Response(
    renderEmail(Content, `${origin}/${props.slug}`, props.data.title),
    { headers: { 'content-type': 'text/html' } },
  );
};
