import { Suspense } from "react";

// Mock data fetching functions (simulate API calls)
async function fetchPost(slug: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
        id: "post-1",
        slug,
        title: "Understanding Parallel Data Fetching",
        content: "This post demonstrates how to optimize data loading...",
        authorId: "user-1",
        createdAt: new Date("2024-01-15"),
    };
}

async function fetchAuthor(authorId: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
        id: authorId,
        name: "Demo Author",
        avatar: "/avatars/demo.jpg",
    };
}

async function fetchComments(postId: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
        { id: "c1", author: "Reader 1", text: "Great article!" },
        { id: "c2", author: "Reader 2", text: "Very helpful, thanks!" },
    ];
}

// ✅ OPTIMIZED: Parallel fetching with Promise.all
async function PostContent({ slug }: { slug: string }) {
    const start = Date.now();

    // First fetch the post (needed for authorId and postId)
    const post = await fetchPost(slug);

    // Then fetch related data in parallel
    const [author, comments] = await Promise.all([
        fetchAuthor(post.authorId),
        fetchComments(post.id),
    ]);

    const duration = Date.now() - start;
    console.log(`[post] Loaded in ${duration}ms (parallel)`);
    // Expected: ~400ms instead of ~600ms sequential

    return (
        <article className="space-y-6">
            <header>
                <h1 className="font-bold text-3xl">{post.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <span>By {author.name}</span>
                    <span>•</span>
                    <time>{post.createdAt.toLocaleDateString()}</time>
                </div>
            </header>

            <div className="prose">
                <p>{post.content}</p>
            </div>

            <section>
                <h2 className="mb-4 font-semibold text-xl">
                    Comments ({comments.length})
                </h2>
                <ul className="space-y-3">
                    {comments.map((comment) => (
                        <li key={comment.id} className="p-3 bg-gray-50 rounded">
                            <strong>{comment.author}</strong>
                            <p>{comment.text}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </article>
    );
}

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <main className="mx-auto max-w-2xl p-8">
            <Suspense
                fallback={<div className="animate-pulse">Loading post...</div>}
            >
                <PostContent slug={slug} />
            </Suspense>
        </main>
    );
}