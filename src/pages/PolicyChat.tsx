import React from 'react';

export const PolicyChat: React.FC = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800">Campus Policy Information</h1>
                <p className="text-slate-500 mt-2">Your guide to Binuscoc's dress code and campus regulations.</p>
            </header>

            <div className="space-y-8">
                {/* Dress Code Policy */}
                <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-3">
                        <i className="fas fa-tshirt text-blue-500"></i> Dress Code Policy
                    </h2>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Binuscoc is committed to fostering a respectful and professional environment.
                        All students, faculty, and staff are expected to adhere to the following dress code guidelines:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li>Appropriate attire is required for all academic and official campus activities.</li>
                        <li>Footwear must be worn at all times. Open-toed sandals are generally permitted, but certain lab or workshop areas may require closed-toe shoes for safety.</li>
                        <li>Sleeveless tops are allowed, provided they are in good taste and do not display offensive content.</li>
                        <li>Clothing with offensive language, symbols, or imagery is strictly prohibited.</li>
                        <li>Shorts and skirts must be of a respectable length, typically reaching at least mid-thigh.</li>
                    </ul>
                    <p className="text-slate-600 mt-4 leading-relaxed">
                        Failure to comply with the dress code may result in a reminder from campus security.
                    </p>
                </section>

                {/* General Campus Regulations */}
                <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-3">
                        <i className="fas fa-university text-emerald-500"></i> General Campus Regulations
                    </h2>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Beyond the dress code, all members of the Binuscoc community are expected to uphold
                        the university's values and adhere to general campus regulations. Key areas include:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li>Respect for property: Damage to university property is strictly prohibited.</li>
                        <li>Academic integrity: All academic work must be original and adhere to honor code.</li>
                        <li>Safety protocols: Follow all posted safety signs and instructions, especially in labs.</li>
                        <li>Noise levels: Maintain reasonable noise levels in study areas and residential zones.</li>
                        <li>Identification: Carry and present valid campus ID upon request by authorized personnel.</li>
                    </ul>
                    <p className="text-slate-600 mt-4 leading-relaxed">
                        A complete list of campus regulations can be found in the Student Handbook.
                    </p>
                </section>

                {/* Contact for Policy Inquiries */}
                <section className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-3">
                        <i className="fas fa-question-circle text-purple-500"></i> Policy Inquiries
                    </h2>
                    <p className="text-slate-600 mb-4">
                        If you have further questions or require clarification on any campus policy,
                        please do not hesitate to contact the relevant departments:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                        <li><strong>Student Affairs Office:</strong> <a href="mailto:studentaffairs@binuscoc.edu" className="text-blue-600 hover:underline">studentaffairs@binuscoc.edu</a></li>
                        <li><strong>Campus Security:</strong> <a href="tel:+1234567890" className="text-blue-600 hover:underline">(123) 456-7890</a></li>
                        <li><strong>Academic Department:</strong> Consult your department's administrative office.</li>
                    </ul>
                    <p className="text-slate-600 mt-4">
                        For emergencies, please contact Campus Security immediately.
                    </p>
                </section>
            </div>
        </div>
    );
};
