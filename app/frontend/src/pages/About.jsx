import ContentWrapper from "../components/ContentWrapper"

const MemberCard = ({ name, linkedin, description }) => {
    return <div className="flex flex-col rounded-sm border-2 border-secondary gap-4 bg-white font-sans p-2">
        <h2 className="text-2xl text-center font-bold">{name}</h2>
        <p>{linkedin}</p>
        <p>{description}</p>
    </div>
}

const About = () => {
    // Example members
    const members = [
        {
            order: 0,
            name: "Member",
            linkedin: "linkedin.com/in/member", 
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloribus!"
        },
        {
            order: 1,
            name: "Member2",
            linkedin: "linkedin.com/in/member2", 
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloribus!"
        },
        {
            order: 2,
            name: "Member3",
            linkedin: "linkedin.com/in/member3", 
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloribus!"
        }
    ]

    return <ContentWrapper>
        <div className="flex flex-col items-center align-middle gap-4 p-4">
            <div className="flex flex-col w-full p-4 gap-2 bg-primary">
                <h1 className="text-4xl font-bold text-center text-black p-2">About Us</h1>
                <div className="bg-white font-sans border-2 border-secondary rounded-sm p-1 text-black text-center *:p-2">The “official” website for CPP Farm Store, allowing people to shop online for drive up orders with ease. This website is built using only the highest quality of AI slop, so security is sure to not be an issue!</div>
            </div>
            
            <a href="/" className="bg-primary-light text-2xl p-3 text-white w-max">Start Shopping!</a>

            <div className="flex flex-col p-4 w-full gap-2 bg-primary">
                <h1 className="w-full text-center text-4xl">Credits</h1>
                <div className="flex flex-col md:grid gap-2 grid-cols-2">{members.map((member, index) => {
                    return <MemberCard key={member.order} name={member.name} linkedin={member.linkedin} description={member.description}/>
                })}</div>
            </div>
        </div>
        </ContentWrapper>
}

export default About