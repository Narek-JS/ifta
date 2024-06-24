import InfoSection from "@/components/universalUI/InfoSection";
import Help from "@/components/home/Help";
import services from "@/data/services.js";

export default function Services() {

    return (
        <div className="sectionPadding servicesPage">
            <div className="mPadding">
                { services.sections.map((el, i) => (
                    <InfoSection
                        key={i}
                        dir={el.dir || false}
                        subTitle={el.subtitle}
                        title={el.title}
                        content={el.content}
                        img={el.img}
                    />
                ))}
            </div>
            <Help width='initial' />
        </div>
    );
};