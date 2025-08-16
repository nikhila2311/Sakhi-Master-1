import Image from 'next/image';
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { FaBookOpen, FaUsers, FaFemale } from 'react-icons/fa'; // Importing icons
import { MdBloodtype } from 'react-icons/md'; // Re-importing MdBloodtype for Menstrual Cycle section

const AccordionSection = ({ icon, title, items }) => (
    <div className='w-full'>
        <span className='flex items-center gap-1 font-semibold mt-10 ml-4'>
            {icon} {title}
        </span>
        <Accordion type='single' collapsible className='flex flex-col w-full mt-2'>
            {items.map((item) => (
                <AccordionItem key={item.value} value={item.value} className='px-4'>
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                    <hr className='w-full' />
                </AccordionItem>
            ))}
        </Accordion>
    </div>
);

export default function Knowledge() {
    const knowledgeSections = [
        {
            icon: <FaBookOpen />,
            title: 'Education & Skills',
            items: [
                {
                    value: 'item-41',
                    trigger: 'Benefits of Education',
                    content: 'Education opens doors to better job opportunities, increases confidence, and improves decision-making skills. It also fosters personal growth and a broader understanding of the world.',
                },
                {
                    value: 'item-42',
                    trigger: 'Developing New Skills',
                    content: 'Learning new skills like digital literacy, crafting, or business basics can empower unemployed women to start their own ventures or find suitable employment. Many free online courses and community workshops are available.',
                },
                {
                    value: 'item-43',
                    trigger: 'Importance of Continuous Learning',
                    content: 'In a rapidly changing world, continuous learning is key to staying relevant and adaptable. It helps in identifying new opportunities and overcoming challenges.',
                },
            ],
        },
        {
            icon: <FaUsers />,
            title: 'Mentoring Support',
            items: [
                {
                    value: 'item-51',
                    trigger: 'What a Mentor Offers',
                    content: 'A mentor provides guidance, shares experiences, offers encouragement, and helps in setting and achieving goals. They can also provide valuable networking opportunities.',
                },
                {
                    value: 'item-52',
                    trigger: 'Finding the Right Mentor',
                    content: 'Look for someone whose experience aligns with your aspirations, who is a good listener, and who is genuinely invested in your growth. Networking events or online platforms can help connect you with mentors.',
                },
                {
                    value: 'item-53',
                    trigger: 'Benefits of Having a Mentor',
                    content: 'Mentorship can boost confidence, provide clarity on career paths, offer emotional support during tough times, and accelerate personal and professional development.',
                },
            ],
        },
        {
            icon: <MdBloodtype />, // Using MdBloodtype for Menstrual Cycle
            title: 'Menstrual Cycle Questions',
            items: [
                {
                    value: 'menstrual-q1',
                    trigger: 'What are the typical phases of the menstrual cycle?',
                    content: 'The menstrual cycle typically has four phases: menstruation, follicular phase, ovulation, and luteal phase.',
                },
                {
                    value: 'menstrual-q2',
                    trigger: 'True or False: Exercise can worsen menstrual cramps.',
                    content: 'False. Light to moderate exercise can actually help relieve menstrual cramps and improve mood by increasing endorphins.',
                },
                {
                    value: 'menstrual-q3',
                    trigger: 'Which hormones primarily fluctuate during the menstrual cycle?',
                    content: 'Estrogen and Progesterone are the primary hormones that fluctuate throughout the menstrual cycle, along with FSH and LH.',
                },
                {
                    value: 'menstrual-q4',
                    trigger: 'What is the average length of a menstrual cycle?',
                    content: 'While 28 days is often cited, a healthy menstrual cycle can range from 21 to 35 days.',
                },
                {
                    value: 'menstrual-q5',
                    trigger: 'What are some common symptoms experienced during the menstrual phase (period)?',
                    content: 'Common symptoms include abdominal cramps, fatigue, headaches, bloating, and mood changes.',
                },
            ],
        },
        {
            icon: <FaFemale />,
            title: 'Pregnancy & Early Motherhood',
            items: [
                {
                    value: 'item-61',
                    trigger: 'Early Stages of Pregnancy',
                    content: 'Understanding the early signs like fatigue, nausea, and changes in appetite is important. Seeking early medical advice confirms the pregnancy and ensures proper care from the beginning.',
                },
                {
                    value: 'item-62',
                    trigger: 'Health During Pregnancy',
                    content: 'Maintaining a balanced diet rich in nutrients, getting adequate rest, and following doctor’s advice are crucial for a healthy pregnancy. Gentle exercise may also be beneficial.',
                },
                {
                    value: 'item-63',
                    trigger: 'Support for New Mothers',
                    content: 'Postpartum support, both emotional and practical, is vital. Connecting with other mothers, seeking help with childcare, and understanding the resources available can ease the transition into motherhood.',
                },
            ],
        },
    ];

    return (
        <div className='flex flex-col items-center'>
            <p className='text-2xl font-semibold text-center text-[#EA5D7A] mt-10'>
                Empowering Women Through Knowledge
            </p>
            <Image src='/assets/knowledge/knowledge.jpg' width={250} height={250} alt="Knowledge illustration" />
            {knowledgeSections.map((section) => (
                <AccordionSection key={section.title} {...section} />
            ))}
        </div>
    );
}