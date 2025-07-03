import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART } from "../graphql/mutations";
import { GET_CART, GET_CART_COUNT } from "../graphql/queries";
import { Product } from "../models/Product";

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    variables: { productId: product.id, quantity: 1 },
    refetchQueries: [{ query: GET_CART }, { query: GET_CART_COUNT }],
  });

  const handleAddToCart = async () => {
    try {
      await addToCart();
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl}
        alt={product.name}
        sx={{
          objectFit: "cover",
          width: "100%",
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 500, lineHeight: 1.2 }}
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {product.shortDescription}
          </Typography>
        </Box>

        <Box>
          <Rating
            name="read-only"
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-start", px: 2, pt: 0, pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(`/product/${product.id}`)}
          sx={{ mr: 1, textTransform: "none" }}
        >
          Show Details
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleAddToCart}
          disabled={loading}
          sx={{
            mr: 1,
            textTransform: "none",
            backgroundColor: "#e0e0e0",
            color: "#000",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#d5d5d5",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Adding..." : "Add To Cart"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
