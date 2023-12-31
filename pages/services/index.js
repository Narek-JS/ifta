import Help from "@/components/home/Help";
import InfoSection from "@/components/universalUI/InfoSection";
import services from "../../data/services.json"

export default function Services() {

    return (
        <div className="sectionPadding servicesPage">
            <div className="mPadding">
                {services.sections?.map((el, i)=> (
                <InfoSection
                    dir={el.dir || false}
                    subTitle={el.subtitle}
                    title={el.title}
                    content={el.content}
                    img={el.img}
                />
                ))}
            </div>
            <Help width='initial'/>
        </div>
    )
}