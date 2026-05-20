"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
    // Clean existing data
    await prisma.vote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.communityMember.deleteMany();
    await prisma.community.deleteMany();
    await prisma.user.deleteMany();
    // Create users
    const hashedPassword = await bcryptjs_1.default.hash("password123", 12);
    const user1 = await prisma.user.create({
        data: {
            email: "john@example.com",
            username: "johndoe",
            password: hashedPassword,
            bio: "Full-stack developer and tech enthusiast",
        },
    });
    const user2 = await prisma.user.create({
        data: {
            email: "jane@example.com",
            username: "janesmith",
            password: hashedPassword,
            bio: "Designer and Reddit addict",
        },
    });
    const user3 = await prisma.user.create({
        data: {
            email: "bob@example.com",
            username: "bobwilson",
            password: hashedPassword,
            bio: "Gamer and meme connoisseur",
        },
    });
    console.log("✅ Users created");
    // Create communities
    const techCommunity = await prisma.community.create({
        data: {
            name: "technology",
            slug: "technology",
            description: "A community for discussing the latest in technology, gadgets, and software.",
            creatorId: user1.id,
            members: {
                create: [
                    { userId: user1.id },
                    { userId: user2.id },
                    { userId: user3.id },
                ],
            },
        },
    });
    const programmingCommunity = await prisma.community.create({
        data: {
            name: "programming",
            slug: "programming",
            description: "Computer programming news, tips, and discussion.",
            creatorId: user1.id,
            members: {
                create: [
                    { userId: user1.id },
                    { userId: user2.id },
                ],
            },
        },
    });
    const gamingCommunity = await prisma.community.create({
        data: {
            name: "gaming",
            slug: "gaming",
            description: "A subreddit for all things gaming. Discuss your favorite games!",
            creatorId: user3.id,
            members: {
                create: [
                    { userId: user3.id },
                    { userId: user1.id },
                ],
            },
        },
    });
    const designCommunity = await prisma.community.create({
        data: {
            name: "design",
            slug: "design",
            description: "UI/UX design, graphic design, and all things visual.",
            creatorId: user2.id,
            members: {
                create: [
                    { userId: user2.id },
                ],
            },
        },
    });
    const funCommunity = await prisma.community.create({
        data: {
            name: "funny",
            slug: "funny",
            description: "Reddit's largest humor depository.",
            creatorId: user3.id,
            members: {
                create: [
                    { userId: user1.id },
                    { userId: user2.id },
                    { userId: user3.id },
                ],
            },
        },
    });
    console.log("✅ Communities created");
    // Create posts
    const post1 = await prisma.post.create({
        data: {
            title: "Next.js 15 is here and it's amazing!",
            content: "The new App Router in Next.js 15 brings incredible performance improvements. Server Components are now the default, and the developer experience has never been better. What features are you most excited about?",
            authorId: user1.id,
            communityId: techCommunity.id,
        },
    });
    const post2 = await prisma.post.create({
        data: {
            title: "What's your favorite programming language in 2025?",
            content: "With so many languages to choose from, I'm curious what everyone's go-to language is. Personally, I've been loving TypeScript for full-stack development. The type safety combined with the flexibility of JavaScript is hard to beat.",
            authorId: user2.id,
            communityId: programmingCommunity.id,
        },
    });
    const post3 = await prisma.post.create({
        data: {
            title: "Just finished building a Reddit clone with React!",
            content: "After months of work, I finally finished my Reddit clone project. Used Next.js, Express, Prisma, and PostgreSQL. It supports communities, posts, comments, and voting. Check it out and let me know what you think!",
            authorId: user1.id,
            communityId: programmingCommunity.id,
        },
    });
    const post4 = await prisma.post.create({
        data: {
            title: "Top 10 indie games you need to play",
            content: "Here are my picks for the best indie games this year:\n\n1. Hollow Knight: Silksong\n2. Hades II\n3. Celeste 2\n4. Dead Cells: Return to Castlevania\n5. Stardew Valley 2\n6. Undertale Yellow\n7. Shovel Knight Dig\n8. Outer Wilds DLC\n9. Cuphead DLC\n10. Ori and the Blind Forest Remaster\n\nWhat would you add to this list?",
            authorId: user3.id,
            communityId: gamingCommunity.id,
        },
    });
    const post5 = await prisma.post.create({
        data: {
            title: "Minimalist UI design trends for 2025",
            content: "Clean, minimal interfaces are making a big comeback. Here are the top trends I'm seeing:\n\n- Glassmorphism 2.0\n- Micro-animations\n- Dark mode by default\n- Variable fonts\n- 3D elements in flat design\n\nWhat design trends are you most excited about?",
            authorId: user2.id,
            communityId: designCommunity.id,
        },
    });
    const post6 = await prisma.post.create({
        data: {
            title: "When the code works on the first try",
            content: "That feeling when you write 200 lines of code and it compiles and runs perfectly on the first try. Just kidding, that never happens 😂",
            authorId: user3.id,
            communityId: funCommunity.id,
        },
    });
    console.log("✅ Posts created");
    // Create votes
    await prisma.vote.createMany({
        data: [
            { userId: user1.id, postId: post1.id, value: 1 },
            { userId: user2.id, postId: post1.id, value: 1 },
            { userId: user3.id, postId: post1.id, value: 1 },
            { userId: user1.id, postId: post2.id, value: 1 },
            { userId: user3.id, postId: post2.id, value: 1 },
            { userId: user2.id, postId: post3.id, value: 1 },
            { userId: user3.id, postId: post3.id, value: -1 },
            { userId: user1.id, postId: post4.id, value: 1 },
            { userId: user2.id, postId: post4.id, value: 1 },
            { userId: user1.id, postId: post5.id, value: 1 },
            { userId: user3.id, postId: post5.id, value: 1 },
            { userId: user1.id, postId: post6.id, value: 1 },
            { userId: user2.id, postId: post6.id, value: 1 },
            { userId: user3.id, postId: post6.id, value: 1 },
        ],
    });
    console.log("✅ Votes created");
    // Create comments
    const comment1 = await prisma.comment.create({
        data: {
            content: "Server components are a game changer! The performance improvements are incredible.",
            authorId: user2.id,
            postId: post1.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: "Totally agree! I've been using them in production and the bundle size reduction is noticeable.",
            authorId: user3.id,
            postId: post1.id,
            parentId: comment1.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: "TypeScript all the way! The DX is unmatched.",
            authorId: user1.id,
            postId: post2.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: "Rust is gaining a lot of traction too. Especially for systems programming.",
            authorId: user3.id,
            postId: post2.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: "This looks amazing! Great work. What was the hardest part of building it?",
            authorId: user2.id,
            postId: post3.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: "Hades II is absolutely incredible. Best roguelike ever made.",
            authorId: user1.id,
            postId: post4.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: "Glassmorphism is so overused now. Give me brutalism any day!",
            authorId: user3.id,
            postId: post5.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: "I once wrote a 500-line function and it worked first try. Then I woke up. 😴",
            authorId: user1.id,
            postId: post6.id,
        },
    });
    console.log("✅ Comments created");
    console.log("🎉 Seeding complete!");
}
main()
    .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map