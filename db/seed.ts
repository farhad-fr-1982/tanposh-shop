import { prisma } from './prisma'; // ایمپورت کردن کلاینتی که قبلا با آداپتور نئون ست کردید
import sampleData from './sample-data';

async function main() {
    console.log('Clearing existing products...');
    // حذف محصولات قبلی
    await prisma.product.deleteMany();
    
    console.log('Inserting sample products...');
    // ایجاد محصولات جدید از sampleData
    await prisma.product.createMany({ 
        data: sampleData.products 
    });
    
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