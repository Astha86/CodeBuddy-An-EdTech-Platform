import React from 'react'


const Stats = [
    {count: "50K", label: "Active Students"},
    {count: "10+", label: "Mentors"},
    {count: "100+", label: "Courses"},
    {count: "70+", label: "Awards"},
];

const StatsComponent = () => {
  return (
    <section>
        <div>
            <div className='flex gap-x-5'>
                {
                    Stats.map( (data, index) => {
                        return (
                            <div key={index}>
                                <h1>
                                    {data.count}
                                </h1>
                                <h2>
                                    {data.label}
                                </h2>
                            </div>
                        )
                    } )
                }
            </div>
        </div>
    </section>
  )
}

export default StatsComponent