function Company() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between p-8">
            <div className="relative w-full md:w-1/3 md:mr-8 mb-8 md:mb-0">
                <div className="absolute inset-0 bg-gray-900 shadow-lg -z-10 transform translate-x-2 translate-y-2 rounded-md"></div>
                <img
                    src="https://picsum.photos/seed/picsum/400/400"
                    alt="logo"
                    className="w-full h-96 object-cover border-4 border-yellow-400 rounded-md transition-transform hover:scale-105 duration-300"
                />
            </div>
            <div className="w-full md:w-2/3 flex flex-col items-start space-y-8">
                <h1 className="text-4xl font-bold text-center md:text-left text-yellow-400 mb-4">Sobre a Empresa</h1>
                <div className="space-y-8">
                    <section id="mission" className="space-y-4">
                        <h2 className="text-2xl font-semibold text-yellow-400">Missão</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam quis risus nec lectus ultrices malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                        </p>
                    </section>
                    <section id="vision" className="space-y-4">
                        <h2 className="text-2xl font-semibold text-yellow-400">Visão</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam quis risus nec lectus ultrices malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                        </p>
                    </section>
                    <section id="values" className="space-y-4">
                        <h2 className="text-2xl font-semibold text-yellow-400">Valores</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam quis risus nec lectus ultrices malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    )
}

export default Company;
