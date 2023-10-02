const {PrismaClient} = require("@prisma/client");

const database = new PrismaClient();

async function main(){
    try {
        await database.category.createMany({
            data : [
                {name : "Computer Science"},
                {name : "Music"},
                {name : "Photography"},
                {name : "Accounting"},
                {name : "Fitness"},
                {name : "Filming"},
                {name : "Engineering"},
            ]
        });

        console.log("Success ✅🔥")
    } catch (error) {
      console.error(`Error seeding the database categories`, error)        
    }finally {
        await database.$disconnect();
    }
}

main();