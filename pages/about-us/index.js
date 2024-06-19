import Help from "@/components/home/Help";
import InfoSection from "@/components/universalUI/InfoSection";
import about from "@/data/about.js"

export default function Services() {
    return (
        <div className="sectionPadding servicesPage">
            <div className="mPadding">
                <InfoSection
                    subTitle={about.sections[0].subtitle}
                    title={about.sections[0].title}
                    content={about.sections[0].content}
                    img={about.sections[0].img}
                />
                <InfoSection
                    dir={true}
                    subTitle={about.sections[1].subtitle}
                    title={about.sections[1].title}
                    content={about.sections[1].content}
                    img={about.sections[1].img}
                />
            </div>
            <Help width='initial'/>
            <div className="mPadding lastInfo">
                <InfoSection
                    subTitle={about.sections[2].subtitle}
                    title={about.sections[2].title}
                    content={about.sections[2].content}
                    img={about.sections[2].img}
                />
            </div>
        </div>
    );
};