import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";

const teamData: TeamType[] = [
  {
    id: 1,
    name: "Mishel Lopez",
    designation: "Desarrolladora",
    image: "/images/team/team-01.png",

    instagramLink: "/#",
  },
  {
    id: 2,
    name: "Jose Perez",
    designation: "desarrollador",
    image: "/images/team/team-02.png",
    instagramLink: "/#",
  },
  {
    id: 3,
    name: "Emmanuel Vargas",
    designation: "Desarrollador",
    image: "/images/team/team-03.png",
    instagramLink: "/#",
  },
  {
    id: 4,
    name: "Emanuel Calvo",
    designation: "Back-end Dev",
    image: "/images/team/team-04.png",

    instagramLink: "/#",
  },
  {
    id: 5,
    name: "Kevin Ramirez",
    designation: "Desarrollador",
    image: "/images/team/team-04.png",
    instagramLink: "/#",
  },
];

const Team = () => {
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px] px-20 lg:px-50"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Nuestro equipo"
            title="Conoce nuetro equipo"
            paragraph=""
            width="640px"
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {teamData.map((team, i) => (
            <SingleTeam key={i} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
