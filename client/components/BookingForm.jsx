'use client';
 import {useState, useEffect} from 'react';
 import {useRouter} from 'next/navigation';
 import toast from 'react-hot-toast';

 export default function BookingForm(){

    const router=useRouter();
    const [formData, setFormData]=useState({
        bus_id: '',
    pickup_location: '',
    dropoff_location: '',
    seats_booked: 1,
    booking_date: '',
  
    });
    const [user, setUser]=useState(null);
    const [location, setLocation]= useState([]);
    const [buses, setBuses]=useState([]);
    const [price, setPrice]=useState(0);
    const [loading, setLoading]=useState("true");

    // fetch me
    useEffect(()=>{
        fetch('/me', {credential: 'include'})
        .then(res =>{
            if (res.status===401){
                router.push('/login');
                return null
            }
            return res.json();
        })
        .then(data=>{
            if (data) setUser(data);
        })
        .finally(()=> setLoading(false));
    }, [])

    // fetch locations and buses
    useEffect(()=>{
        fetch('/location')
        .then(res=> res.json())
        .then(setLocation)
    });
    
    useEffect(()=>{
        fetch('/buses')
        .then(res=>res.json())
        .then(setBuses)
    });

    // price calculation
    useEffect(() => {
    const { pickup, dropoff, busId, seats } = formData;
    if (pickup && dropoff && pickup !== dropoff && busId) {
      const selectedBus = buses.find(b => b.id === parseInt(busId));
      const routeDistance = selectedBus?.route?.distance || 0;
      const cost = routeDistance * 1.25 * seats;
      setPrice(Math.round(cost));
    } else {
      setPrice(0);
    }
  }, [formData, buses]);

  //handling form submission
  function handleSubmit(event){
    event.preventDefault();


    if (formData.pickup === formData.dropoff){
        toast.error("Pickup and drop off cannot be the same");
        return;
    }
    
    const payLoad={
      bus_id: parseInt(formData.busId),
      pickup_location: formData.pickup,
      dropoff_location: formData.dropoff,
      seats_booked: parseInt(formData.seats),
      booking_date: new Date().toISOString().slice(0, 10),
      price: price
    };

    fetch('/bookings',{
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(payLoad),
    })
    .then(res =>{
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(()=>{
        toast.success('Booking Successful');
        router.push('/my-bookings');
    })
    .catch(() => toast.error('Booking failed.'));
  }
  if (loading) return <p>Loading...</p>;

    return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Book a School Ride</h2>

      <select
        value={formData.pickup}
        onChange={e => setFormData({ ...formData, pickup: e.target.value })}
        required
      >
        <option value="">Select Pickup</option>
        {location.map(loc => (
          <option key={loc.id} value={loc.name_location}>{loc.name_location}</option>
        ))}
      </select>

      <select
        value={formData.dropoff}
        onChange={e => setFormData({ ...formData, dropoff: e.target.value })}
        required
      >
        <option value="">Select Dropoff</option>
        {location.map(loc => (
          <option key={loc.id} value={loc.name_location}>{loc.name_location}</option>
        ))}
      </select>

      <select
        value={formData.busId}
        onChange={e => setFormData({ ...formData, busId: e.target.value })}
        required
      >
        <option value="">Select Bus</option>
        {buses.map(bus => (
          <option key={bus.id} value={bus.id}>
            {bus.name} (Route: {bus.route?.distance} km)
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        value={formData.seats}
        onChange={e => setFormData({ ...formData, seats: e.target.value })}
        placeholder="Seats"
        required
      />

      <div>
        <p className="font-bold">Total Price: KES {price}</p>
      </div>

      <button
        type="submit"
        disabled={formData.pickup === formData.dropoff}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Submit Booking Request
      </button>
    </form>
  );
}