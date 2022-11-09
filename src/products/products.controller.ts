import { ProductsService } from './products.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductDto } from 'src/dtos/product.dto';
import { EditProductDto } from 'src/dtos/editProduct.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    const result = await this.productsService.createProduct(productDto);
    return result;
  }

  @Get()
  async getListProducts() {
    const result = await this.productsService.getAllProduct();
    return result;
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const result = await this.productsService.getProductById(id);
    return result;
  }

  @Patch(':id')
  async editProduct(
    @Param('id') id: string,
    @Body() productDto: EditProductDto,
  ) {
    const result = await this.productsService.changeProduct(id, productDto);

    return result;
  }
}
