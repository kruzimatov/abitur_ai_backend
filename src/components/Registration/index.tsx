const Registration = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Hisob yaratish</h2>
        <p className="text-gray-400 text-sm">Bepul boshlang</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-300 block mb-1">Ism</label>
          <input placeholder="Alisher" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" />
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-300 block mb-1">Familiya</label>
          <input placeholder="Karimov" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Email</label>
        <input placeholder="sizning@email.com" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" />
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Parol</label>
        <input type="password" placeholder="Kamida 8 belgi" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" />
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Fan tanlang</label>
        <select className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none text-white focus:border-blue-500 transition">
          <option>Matematika</option>
          <option>Fizika</option>
        </select>
      </div>

      <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/20">
        Hisob yaratish
      </button>
    </div>
  );
};
export default Registration;