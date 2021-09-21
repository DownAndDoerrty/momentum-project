
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    const p1 = await prisma.user.create({ data: {
        firstName: "Chris",
        lastName: "Athanas",
        email: "chris@chris.com",
        passwordHash: "fsd9ujh43fn34oisdg0943",
        profilePictureURL: "https://randomuser.me/api/portraits/men/72.jpg"
    }});
    const p2 = await prisma.user.create({ data: {
        firstName: "Harry",
        lastName: "Stephens",
        email: "harry@harry.com",
        passwordHash: "98hswvoknw4gv402w98",
        profilePictureURL: "https://upload.wikimedia.org/wikipedia/commons/7/71/2010-kodiak-bear-1.jpg"
    }});
    const p3 = await prisma.user.create({ data: {
        firstName: "Jake",
        lastName: "Haley",
        email: "jake@jake.com",
        passwordHash: "iuhbsdvg984n2ssdjk",
        profilePictureURL: "https://superheroera.com/wp-content/uploads/2021/08/Hunter-x-Hunter-Is-Hisoka-Dead-e.jpg"
    }});
    const p4 = await prisma.user.create({ data: {
        firstName: "David",
        lastName: "Rasch",
        email: "david@david.com",
        passwordHash: "fas98fh43294323k4j",
        profilePictureURL: "https://avatars.githubusercontent.com/u/221605?v=4"
    }});
    const c1 = await prisma.campaign.create({ data: {
        campaignOwnerId: p1.userId,
        campaignName: "Chris' Campaign",
        campaignDescription: "Chris' Donation Campaign",
        campaignPictureURL: "",
    }});
    const c2 = await prisma.campaign.create({ data: {
        campaignOwnerId: p2.userId,
        campaignName: "Save the Whales",
        campaignDescription: "awhoooooOOOOooooooOOOOoooo",
        campaignPictureURL: "https://i2.wp.com/whalescientists.com/wp-content/uploads/2020/10/OC_Slide_2_07.jpg?fit=980%2C654&ssl=1",
    }});
    const c3 = await prisma.campaign.create({ data: {
        campaignOwnerId: p3.userId,
        campaignName: "Eliminate the Whales",
        campaignDescription: "The whales have ruled these seas for far too long.",
        campaignPictureURL: "http://i.cdn-surfline.com/fishtrack/2015/Editorial/10_Oct/Harpoon/Harpoon_Tips_01.jpg",
    }});
    const c4 = await prisma.campaign.create({ data: {
        campaignOwnerId: p4.userId,
        campaignName: "TMUX Awareness",
        campaignDescription: "VSCode will pay for its transgressions",
        campaignPictureURL: "https://www.hamvocke.com/assets/img/uploads/tmux.png",
    }});
    await prisma.donation.create({ data: {
        donorUserId: p1.userId,
        campaignId: c1.campaignId,
        donationAmount: 1000000,
        donationNote: "Just getting this baby started",
    }});
    
}


main().then(() => {
    console.log("done");
})