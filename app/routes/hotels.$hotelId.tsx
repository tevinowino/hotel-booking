import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { ObjectId } from "mongodb";

export async function loader({ params }: LoaderFunctionArgs) {
  const hotel = await db
    .db()
    .collection("hotels")
    .findOne({ _id: new ObjectId(params.hotelId) });

  if (!hotel) {
    throw new Response("Not Found", { status: 404 });
  }

  const rooms = await db
    .db()
    .collection("rooms")
    .find({ hotelId: params.hotelId })
    .toArray();

  const reviews = await db
    .db()
    .collection("reviews")
    .find({ hotelId: params.hotelId })
    .toArray();

  return json({ hotel, rooms, reviews });
}

export default function HotelDetails() {
  const { hotel, rooms, reviews } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hotel Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
          <p className="text-gray-600">{hotel.address}, {hotel.city}, {hotel.country}</p>
          <div className="mt-4 flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-600">{hotel.rating}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {hotel.images.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`${hotel.name} - Image ${index + 1}`}
              className="rounded-lg object-cover w-full h-64"
            />
          ))}
        </div>

        {/* Rooms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
          <div className="grid grid-cols-1 gap-6">
            {rooms.map((room) => (
              <div key={room._id.toString()} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{room.type}</h3>
                    <p className="text-gray-600 mt-2">{room.description}</p>
                    <ul className="mt-4 space-y-2">
                      {room.amenities.map((amenity: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="mr-2">•</span>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${room.price}</p>
                    <p className="text-gray-600">per night</p>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id.toString()} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}