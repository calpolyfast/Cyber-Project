import ContentWrapper from "../components/ContentWrapper"

const MemberCard = ({ name, linkedin, description }) => {
    return <div className="flex flex-col rounded-sm border-2 border-secondary gap-4 bg-white font-sans p-2">
        <h2 className="text-2xl text-center font-bold">{name}</h2>
        <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {linkedin}
        </a>
        <p>{description}</p>
    </div>
}

const About = () => {
    // Example members
    const members = [
        {
            order: 0,
            name: "Jack Woline",
            linkedin: "linkedin.com/in/jonathan-woline", 
            description: "Director for the research project and leader of the development of this wonderfully secure website!"
        },
        {
            order: 1,
            name: "Theoden Melgar",
            linkedin: "linkedin.com/in/theoden-melgar", 
            description: "Hi! I was the backend lead for this project. Have fun learning about some common web vulnerabilities and do your best to break our site :) "
        },
        {
            order: 2,
            name: "Member3",
            linkedin: "linkedin.com/in/member3", 
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, doloribus!"
        }
    ]

    return <ContentWrapper>
            <h1 className="text-4xl font-bold text-center text-black p-2">About Us</h1>
            <div className="bg-white font-sans border-2 border-secondary rounded-sm text-black p-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi iste, hic aperiam eum voluptatibus eius neque a ipsa, ipsum vitae provident, beatae pariatur sunt quia.</div>
            <div className="flex flex-col md:grid gap-2 grid-cols-2">{members.map((member, index) => {
                return <MemberCard key={member.order} name={member.name} linkedin={member.linkedin} description={member.description}/>
            })}</div>
        </ContentWrapper>
}

export default About