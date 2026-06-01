import { prisma } from './prisma'; // ایمپورت کردن کلاینتی که قبلا با آداپتور نئون ست کردید
import sampleData from './sample-data';

async function main() {
    console.log('Clearing existing products...');
    
    // کدهای پاک‌سازی مطابق با عکس شما
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('Inserting sample products...');
    
    await prisma.product.createMany({ data: sampleData.products });
    await prisma.user.createMany({ data: sampleData.users });
    
    console.log('Database seeded successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });