const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export const addToCart = async (productItemId, qty) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User is not authenticated");
    return { error: "User is not authenticated" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/shopping_cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_item_id: productItemId, qty }),
    });

    const data = await response.json();
    if (response.ok) {
      // console.log("Item added to cart:", data);
      return { success: true, data };
    } else {
      // console.error("Error:", data.message);
      return { error: data.message };
    }
  } catch (error) {
    // console.error("Network error:", error);
    return { error: "Network error" };
  }
};
