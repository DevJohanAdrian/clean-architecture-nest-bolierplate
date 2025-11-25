import { Controller, Get, Post, Body, Param, Delete, Put, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { IUser } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create user endpoint with custom rate limiting
   * 
   * @Throttle() decorator applies custom rate limits to this specific endpoint,
   * overriding the global configuration. This is useful for:
   * - Resource-intensive operations that need stricter limits
   * - Endpoints vulnerable to abuse (like user registration)
   * - Operations that should have different short-term and long-term limits
   * 
   * Configuration:
   * - 'short': 3 requests per 60 seconds (1 minute)
   * - 'long': 20 requests per 3600 seconds (1 hour)
   * 
   * These limits are more restrictive than the global defaults to prevent
   * abuse of the user creation endpoint.
   */
  // @Throttle({ short: { ttl: 60000, limit: 3 }, long: { ttl: 3600000, limit: 20 } })
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto);
  // }

  // // @Post()
  // // create(@Req() req: Request, @Res() res: Response) {
  // //   // Accede al cuerpo de la solicitud directamente
  // //   const createUserDto = req.body as CreateUserDto;

  // //   // Llama al servicio y responde con el resultado
  // //   const result = this.usersService.create(createUserDto);
  // //   return res.status(201).json(result);
  // // }

  // @Get('getall')
  // findAll(@Req() req: Request, @Res() res: Response) {
  //   res.json('hola mundo');
  //   // return this.usersService.findAll();
  //   // :Promise<IUser>
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }


   @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
