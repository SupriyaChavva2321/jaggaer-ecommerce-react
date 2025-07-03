import {
  Grid,
  Container,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import { Product } from "../models/Product";

const Products = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  const renderLoading = () => (
    <Grid container spacing={4}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      ))}
    </Grid>
  );

  const renderProducts = () =>
    data.products.map((product: Product) => (
      <Grid item xs={12} sm={6} md={6} lg={6} key={product.id}>
        <ProductCard product={product} />
      </Grid>
    ));

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        All Products
      </Typography>

      {loading ? (
        renderLoading()
      ) : error ? (
        <Box textAlign="center" py={4}>
          <Typography color="error">Failed to load products.</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {renderProducts()}
        </Grid>
      )}
    </Container>
  );
};

export default Products;
